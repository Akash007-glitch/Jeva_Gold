module.exports = {
    type: 'custom',
    routes: [
        {
            method: 'POST',
            path: '/create-order',
            handler: 'api::order.order.createOrder',
            config: { auth: false },
        },
        {
            method: 'POST',
            path: '/verify-payment',
            handler: 'api::order.order.verifyPayment',
            config: { auth: false },
        },
    ],
};