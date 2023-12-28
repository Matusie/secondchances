//mocking natsWrapper which actually contains Stan, in client property
// we don't care about other properties, like Promoise or whatever because its not really needed
// Stan implementation is provided by publish method, that is located in Publisher

export const natsWrapper = {
    client: { //we added mock jest function because test were saying it has to be mock function
        publish: jest.fn().mockImplementation( (subject: string, data: string, callback: ()=> void) =>{
            callback();
        }),
    },
};