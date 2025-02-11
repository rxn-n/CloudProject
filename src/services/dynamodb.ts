import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  PutCommand, 
  UpdateCommand, 
  QueryCommand,
  TransactWriteCommand
} from '@aws-sdk/lib-dynamodb';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

// Initialize SNS client
const snsClient = new SNSClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

// Initialize Lambda client
const lambdaClient = new LambdaClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Map DynamoDB item to frontend Ticket model
const mapDynamoItemToTicket = (item: any) => ({
  id: item.TicketID,
  name: item.concertName,
  category: item.category,
  status: item.availabilityStatus,
  price: item.ticketPrice,
  date: item.openSaleDate,
  venue: item.venue,
  image: item.image,
  artist: item.artist,
  quantity: item.quantity
});

export const getAllTickets = async () => {
  try {
    const command = new ScanCommand({
      TableName: 'ConcertsAndTickets',
    });

    const response = await docClient.send(command);
    return response.Items?.map(mapDynamoItemToTicket);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const updateTicketQuantity = async (concertId: string, ticketId: string, quantityToReduce: number) => {
  try {
    const command = new UpdateCommand({
      TableName: 'ConcertsAndTickets',
      Key: {
        ConcertID: concertId,
        TicketID: ticketId,
      },
      UpdateExpression: 'set quantity = quantity - :qty',
      ExpressionAttributeValues: {
        ':qty': quantityToReduce,
      },
      ReturnValues: 'ALL_NEW',
      ConditionExpression: 'quantity >= :qty',
    });

    const response = await docClient.send(command);
    return mapDynamoItemToTicket(response.Attributes);
  } catch (error) {
    console.error('Error updating ticket quantity:', error);
    throw error;
  }
};

export const createBooking = async (bookingData: {
  bookingId: string;
  ticketId: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  totalPrice: number;
  concertDetails: {
    concertId: string;
    name: string;
    category: string;
    date: string;
    venue: string;
    artist: string;
  };
}) => {
  try {
    // First, update the ticket quantity
    await updateTicketQuantity(
      bookingData.concertDetails.concertId,
      bookingData.ticketId,
      bookingData.quantity
    );

    // Create the booking record
    const command = new PutCommand({
      TableName: 'Bookings',
      Item: {
        BookingID: bookingData.bookingId,
        TicketID: bookingData.ticketId,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        quantity: bookingData.quantity,
        totalPrice: bookingData.totalPrice,
        bookingDate: new Date().toISOString(),
        paymentStatus: 'completed',
        concertDetails: bookingData.concertDetails
      },
    });

    await docClient.send(command);

    // Send SNS notification
    const snsCommand = new PublishCommand({
      TopicArn: import.meta.env.VITE_SNS_TOPIC_ARN,
      Message: JSON.stringify({
        customerEmail: bookingData.customerEmail,
        customerName: bookingData.customerName,
        bookingDetails: {
          concertName: bookingData.concertDetails.name,
          quantity: bookingData.quantity,
          totalPrice: bookingData.totalPrice,
          date: bookingData.concertDetails.date,
          venue: bookingData.concertDetails.venue
        }
      }),
      Subject: 'New Ticket Booking Confirmation'
    });

    await snsClient.send(snsCommand);

    // Invoke Lambda function
    const lambdaCommand = new InvokeCommand({
      FunctionName: import.meta.env.VITE_LAMBDA_FUNCTION_NAME,
      Payload: JSON.stringify({
        bookingId: bookingData.bookingId,
        customerEmail: bookingData.customerEmail,
        bookingDetails: {
          concertName: bookingData.concertDetails.name,
          quantity: bookingData.quantity,
          totalPrice: bookingData.totalPrice
        }
      })
    });

    await lambdaClient.send(lambdaCommand);

    return bookingData.bookingId;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getTicketsByCategory = async (concertId: string, category: string) => {
  try {
    const command = new QueryCommand({
      TableName: 'ConcertsAndTickets',
      KeyConditionExpression: 'ConcertID = :concertId',
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':concertId': concertId,
        ':category': category,
      },
    });

    const response = await docClient.send(command);
    return response.Items?.map(mapDynamoItemToTicket);
  } catch (error) {
    console.error('Error fetching tickets by category:', error);
    throw error;
  }
};

export const getBookingsByCustomer = async (customerEmail: string) => {
  try {
    const command = new ScanCommand({
      TableName: 'Bookings',
      FilterExpression: 'customerEmail = :email',
      ExpressionAttributeValues: {
        ':email': customerEmail,
      },
    });

    const response = await docClient.send(command);
    return response.Items;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};