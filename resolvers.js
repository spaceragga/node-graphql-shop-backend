const fs = require("fs");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    pizzas: (_, { limit = 3, offset = 0 }) => {
      const pizzasArr = JSON.parse(
        fs.readFileSync("mock_data/pizzas.json", {
          encoding: "utf8",
        })
      );

      const endIndex = offset + limit;
      return pizzasArr.slice(offset, endIndex);
    },
    orders: () =>
      JSON.parse(
        fs.readFileSync("mock_data/orders.json", {
          encoding: "utf8",
        })
      ),
  },
  Mutation: {
    addOrder: (_, { order }) => {
      const ordersData = JSON.parse(
        fs.readFileSync("mock_data/orders.json", {
          encoding: "utf8",
        })
      );

      fs.writeFileSync(
        "mock_data/orders.json",
        JSON.stringify([...ordersData, ...order])
      );

      const pizzasArr = JSON.parse(
        fs.readFileSync("mock_data/pizzas.json", {
          encoding: "utf8",
        })
      );

      const updatedPizzasArr = pizzasArr.map((p) => {
        const inputPizza = order.find((ip) => {
          const newId = ip.id.toLowerCase();
          return newId === p.id;
        });

        if (inputPizza) {
          return { ...p, amount: p.amount - inputPizza.amount };
        }
        return p;
      });

      fs.writeFileSync(
        "mock_data/pizzas.json",
        JSON.stringify(updatedPizzasArr)
      );

      pubsub.publish("PIZZAS_UPDATED", updatedPizzasArr);

      return order;
    },
  },
  Subscription: {
    pizzasUpdated: {
      subscribe: () =>
        pubsub.asyncIterator("PIZZAS_UPDATED", () => {
          return JSON.parse(
            fs.readFileSync("mock_data/pizzas.json", {
              encoding: "utf8",
            })
          );
        }),
    },
  },
};

module.exports = resolvers;
