import {
  SNSClient,
  SubscribeCommand
} from "@aws-sdk/client-sns";

const sns = new SNSClient({});

const TOPIC_ARN =
  "arn:aws:sns:us-east-1:755610857977:robotic-subscribers";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST"
};

export const handler = async (event) => {

  if (
    event.httpMethod === "OPTIONS" ||
    event.requestContext?.http?.method === "OPTIONS"
  ) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ""
    };
  }

  try {

    const body = JSON.parse(event.body);

    if (!body.email) {

      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Email is required."
        })
      };

    }

    await sns.send(

      new SubscribeCommand({

        TopicArn: TOPIC_ARN,
        Protocol: "email",
        Endpoint: body.email

      })

    );

    return {

      statusCode: 200,

      headers: corsHeaders,

      body: JSON.stringify({

        success: true,
        message:
          "Subscription request sent. Please check your email and confirm the subscription."

      })

    };

  } catch (err) {

    console.error(err);

    return {

      statusCode: 500,

      headers: corsHeaders,

      body: JSON.stringify({

        success: false,
        error: err.message

      })

    };

  }

};