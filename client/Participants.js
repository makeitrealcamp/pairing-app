import React from 'react';
import Loading from './Loading';
import Pagination from './Pagination';
import Alert from './Alert';
import Participant from './Participant';
import participants from './services/participants';

export default class Participants extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      query: "",
      page: 1,
      pages: 1,
      participants: [],
      count: 0,
      alert: null
    };
  }

  async componentDidMount() {
    const response = await participants.findAll();
    if (response) {
      const pages = Math.ceil(response.count / response.perPage);
      this.setState({
        loading: false,
        participants: response.documents,
        count: response.count,
        pages
      });
    } else {
      this.setState({
        loading: false,
        alert: {
          variant: "error",
          text: `Ha ocurrido un error inesperado. Refresca la página e intenta nuevamente.`
        }
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <div className="page-common participants-page">
        <div className="searchForm">
          <input className="search" onChange={this.onSearchChange.bind(this)} onKeyPress={this.search.bind(this)} value={this.state.query} placeholder="Buscar ..." />
        </div>

        <table>
          <thead>
            <tr>
              <th></th>
              <th>Email</th>
              <th>Name</th>
              <th>Github</th>
            </tr>
          </thead>
          <tbody>
            {this.state.participants.map(p => <Participant participant={p} key={p._id} />)}
          </tbody>
        </table>

        <Pagination page={this.state.page} pages={this.state.pages} onPageChange={this.changePage.bind(this)} />

        {this.state.alert ? <Alert variant={this.state.alert.variant}>{this.state.alert.text}</Alert> : null}
      </div>
    );
  }

  onSearchChange(e) {
    this.setState({ query: e.target.value });
  }

  async search(e) {
    if (e.key === 'Enter') {
      const response = await participants.findAll(this.state.query, 1);

      const pages = Math.ceil(response.count / response.perPage);
      this.setState({
        participants: response.documents,
        pages,
        page: 1
      });
    }
  }

  async changePage(e, p) {
    e.preventDefault();

    const response = await participants.findAll(this.state.query, p);
    this.setState({
      participants: response.documents,
      page: p
    });
  }
}
