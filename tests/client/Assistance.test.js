import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import sinon from 'sinon';
import axios from 'axios';
import Assistance from '../../client/Assistance';
import { mount } from 'enzyme';
import { signIn } from '../util';

it('renders enqueued assistance', async () => {
  const stub = sinon.stub(axios, 'get');
  await signIn(stub);

  stub.withArgs('/sessions/open', sinon.match.any).resolves({ data: { _id: 1 } });
  stub.withArgs('/sessions/1/assistance', sinon.match.any).resolves({ data: { status: 'enqueued' } });
  stub.rejects({ response: { status: 404 } });

  let wrapper = await mount(
    <MemoryRouter initialEntries={['/assistance']}>
      <Route exact path="/" render={(props) => <p>Dummy</p>} />
      <Route path="/assistance" component={Assistance} />
    </MemoryRouter>
  );

  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(wrapper.html()).toContain('Iniciando sesión de pair programming ... ');
});
