import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from "./Loading";
import FormGroup from "./FormGroup";
import Alert from "./Alert";
import assistances from "./services/assistances";
import _ from "lodash";

export default class Feedback extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      assistance: null,
      errors: {},
      alert: null
    };

    this.onClassInputChange = this.onClassInputChange.bind(this);
    this.onExercisesInputChange = this.onExercisesInputChange.bind(this);
    this.onPartnerInputChange = this.onPartnerInputChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  async componentDidMount() {
    const assistance = await assistances.findById(this.props.match.params.id);
    if (assistance) {
      assistance.feedback = assistance.feedback || { rating: 0 };
      this.setState({ loading: false, assistance });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    const feedback = this.state.assistance.feedback;
    return (
      <div className="feedback-page">
        <div className="form-group rating">
          {Array.apply(null, { length: feedback.rating }).map((e, i) => (
            <FontAwesomeIcon key={i} icon={['fas', 'star']} onClick={() => this.rate(i + 1)} className="rating-star highlighted" />
          ))}

          {Array.apply(null, { length: 5 - feedback.rating }).map((e, i) => (
            <FontAwesomeIcon key={i} icon={['far', 'star']} onClick={() => this.rate(feedback.rating + i + 1)} className="rating-star" />
          ))}
        </div>
        <FormGroup error={this.state.errors.class}>
          <label for="feedback-class">¿Cómo te pareció la clase de hoy?</label>
          <textarea id="feedback-class" onChange={this.onClassInputChange} rows="3" value={ feedback.class } autoFocus></textarea>
        </FormGroup>
        <div className="form-group">
        <label for="feedback-exercises">¿Cómo te parecieron los ejercicios?</label>
          <textarea onChange={this.onExercisesInputChange} rows="3" value={ feedback.exercises }></textarea>
        </div>
        {
          this.state.assistance.status == "paired" ?
            <div className="form-group">
              <label for="feedback-partner">¿Cómo te fue con tu pareja de programación?</label>
              <textarea onChange={this.onPartnerInputChange} rows="3" value={ feedback.partner }></textarea>
            </div>
          :
            null
        }

        <div className="actions">
          <Link to="/assistance">Volver</Link>
          <button onClick={this.submit} className="btn">Enviar</button>
        </div>

        {this.state.alert ? <Alert variant={this.state.alert.variant}>{this.state.alert.text}</Alert> : null}
      </div>
    )
  }

  rate(rating) {
    this.setState({
      assistance: _.merge(this.state.assistance, { feedback: { rating: rating } })
    });
  }

  onClassInputChange(e) {
    const value = e.target.value;

    this.setState({
      assistance: _.merge(this.state.assistance, { feedback: { class: value } }),
      errors: {}
    });

    if (value.trim().length === 0) {
      this.setState({
        errors: { ...this.state.errors, class: "is required" }
      });
    }
  }

  onExercisesInputChange(e) {
    this.setState({
      assistance: _.merge(this.state.assistance, { feedback: { exercises: e.target.value } })
    });
  }

  onPartnerInputChange(e) {
    this.setState({
      asssitance: _.merge(this.state.assistance, { feedback: { partner: e.target.value }})
    });
  }

  async submit() {
    if (this.state.assistance.feedback.rating === 0) {
      this.setState({ alert: { variant: "error", text: "Debes calificar la sesión" } });
      setTimeout(() => {
        this.setState({ alert: null });
      }, 4000);
    } else {
      await assistances.update(this.state.assistance, { status: "rated", feedback: this.state.assistance.feedback });
      this.props.history.push('/thank-you');
    }
  }
}
