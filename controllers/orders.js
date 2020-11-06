const Orders = require("../models/orders");
const _ = require("lodash");
const { forEach } = require("lodash");

exports.saveOrders = async (req, res) => {
	let oldOrders = await Orders.findOne({});
	if (oldOrders !== null) {
		let _orders = oldOrders.orders;

		// if (!_(_orders).differenceWith(req.body.orders, _.isEqual).isEmpty()) {
		// 	oldOrders = _.extend(oldOrders, { orders: _orders });
		//   await oldOrders.save();
		//   return res.status(200).json({
		// 		res: oldOrders,
		// 	});
		// }

		if (req.body.orders.length !== _orders.length) {
      let g_arr;
      let s_arr;

      let new_orders = [];

      if (req.body.orders.length > _orders.length) {
        g_arr = req.body.orders
        s_arr = _orders
      } else {
        s_arr = req.body.orders;
				g_arr = _orders;
      } 

      console.log("new: ", g_arr)
      console.log("old: ", s_arr);

      for (let a = 0; a < g_arr.length; a++) {
        let exists = false;
        for (let b = 0; b < s_arr.length; b++) {
          if (g_arr[a].id === s_arr[b].id) {
            exists = true
            console.log('here')
          }
        }
        if (!exists) {
          new_orders.push(g_arr[a])
        }
      }

      console.log("latest: ", new_orders)

			oldOrders = _.extend(oldOrders, { orders: req.body.orders });
			await oldOrders.save();
			return res.status(200).json({
				res: new_orders,
			});
		}

		return res.status(200).json({
			res: "same orders",
		});
	}

	if (oldOrders === null) {
		let orders = await new Orders(req.body);
		await orders.save();
		return res.status(200).json({
			res: orders,
		});
	}
};

exports.getOrders = (req, res) => {
Orders.find((error, orders) => {
	if (error) {
		return res.status(400).json({
			error,
		});
	}
	res.json({
		orders: orders,
	})
}).select(
	"orders",
);
}