import sinon from 'sinon';
import axios from 'axios';
import auth from '../client/services/auth';

const signIn = async stubGet => {
  sinon.stub(axios, "post")
    .withArgs("/auth/github/token", sinon.match.any).resolves({ data: { token: "123", }});

  stubGet.withArgs("/participant", sinon.match.any).resolves({ data: { _id: 1 } });

  await auth.withCode("123");
}

export { signIn };
