import nats, {Stan} from 'node-nats-streaming';
//folder to manage nats cilent in certain microservice
//before connecting we actually want to chech maybe if we are already connected
// so we can't use it before its already ready to use, to make that happen we introduce ts getter
class NatsWrapper {
    get client(){
        if(!this._client){
            throw new Error('NATS nie gotow');
        }
        return this._client;
    }
    _client?: Stan; //? for the sake of TS
    //very similar to mongoose, we will call the connection settings 
    connect(clusterId: string, clientId: string, url: string){
        this._client = nats.connect(clusterId, clientId, {url});
//taking callback and making it allow us to use async syntax with Promise, again resolve and reject
        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
              console.log('Connected to NATS');
              resolve();
            });
            this.client.on('error',(error) => {
reject(error);
            });
    });
}
}



export const natsWrapper = new NatsWrapper();