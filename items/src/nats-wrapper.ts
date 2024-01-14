import nats, {Stan} from 'node-nats-streaming';
//przed polaczeniem z NATS, musimy miec klienta, ktory bedzie w stanie polaczyc sie z NATS
// getter, ktory bedzie zwracal klienta jezeli jest polaczony wczesniej
class NatsWrapper {
    get client(){
        if(!this._client){
            throw new Error('NATS nie gotow');
        }
        return this._client;
    }
    _client?: Stan; //STAN jest biblioteka do NATS odpowiedzialna za polaczenie
    //polaczenie z NATS
    connect(clusterId: string, clientId: string, url: string){
        this._client = nats.connect(clusterId, clientId, {url});

        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
              console.log('Polaczono z NATS');
              resolve();
            });
            this.client.on('error',(error) => {
//error 
reject(error);
            });
    });
}
}



export const natsWrapper = new NatsWrapper();