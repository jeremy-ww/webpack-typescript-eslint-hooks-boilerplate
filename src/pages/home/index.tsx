import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import React from 'react'

import { State } from '../../store/'

@(withRouter as any)
@((connect as any)((state: State) => ({
  user: state.user
})))
export default class Home extends React.Component<HomeProps> {
  render() {
    return (
      <div className="hello">
        Hello, {this.props.user.name} <small>- ({process.env.NODE_ENV})</small>
      </div>
    )
  }
}

export interface HomeProps extends RouteComponentProps {
  user: State['user']
}
