const express = require("express");
const routes = require("./src/routes/route");
const config = require("./src/config");
const cors = require("cors");
const stripe = require("stripe")(config.stripe_secret);
const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://favget.vercel.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,POST,PUT,PATCH,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/", routes);


const quantity = 1

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `https://favget.vercel.app/home`,
      cancel_url: `https://favget.vercel.app/home`,
      line_items: [
        {
          price: config.STRIPE_PRICE_ID,
          // quantity: quantity,
          quantity: 1,
        },
      ],
      mode: 'subscription',
    });
    console.log("session: ", session.id, session.url, session)

    // get id, save to user, return url
    const sessionId = session.id;
    console.log("sessionId: ", sessionId);

    // save session.id to the user in your database

    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get("/stripe-session", async (req, res) => {
  console.log("req.body: ", req.body);
  const { userId } = req.body;
  console.log("userId: ", userId);

  const db = req.app.get('db');

  // get user from you database
  const user = {
    stripe_session_id: "asdfpouhwf;ljnqwfpqo",
    paid_sub: false
  }

  if(!user.stripe_session_id || user.paid_sub === true) 
  return res.send("fail");

  try {
      // check session
      const session = await stripe.checkout.sessions.retrieve(user.stripe_session_id);
      console.log("session: ", session);
    
      // update the user
      if (session && session.status === "complete") {
        let updatedUser = await db.update_user_stripe(
          userId,
          true
        );
        updatedUser = updatedUser[0];
        console.log(updatedUser);
    
        return res.send("success");
      } else {
        return res.send("fail");
      }
  } catch (error) {
      // handle the error
      console.error("An error occurred while retrieving the Stripe session:", error);
      return res.send("fail");
  }
})




app.listen(config.port, () => {
  console.log(`Application listening on port ${config.port}`);
});
