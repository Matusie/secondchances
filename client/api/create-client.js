//axios twice, once when we are rendering on the server, once when in the browser
import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
// pracujemy na serwerze
// przy uzyciu ingress-nginx w k8s, musimy sie odwolac do serwisu, a nie do poda
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // Praca na przegladarce
    return axios.create({
      baseUrl: '/',
    });
  }
};
