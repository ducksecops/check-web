import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Relay from 'react-relay';
import FlatButton from 'material-ui/FlatButton';
import ProjectRoute from './ProjectRoute';
import Can from '../components/Can';
import CheckContext from '../CheckContext';
import { black38 } from '../styles/js/shared';

class ProjectMenu extends Component {
  handleEditClick() {
    const history = new CheckContext(this).getContextStore().history;
    const editPath = `${window.location.pathname.match(/.*\/project\/\d+/)[0]}/edit`;
    history.push(editPath);
  }

  render() {
    const { project } = this.props;

    return (
      <Can permissions={project.permissions} permission="update Project">
        <FlatButton
          key="projectMenuRelay.editProject"
          className="project-menu"
          onClick={this.handleEditClick.bind(this)}
          style={{ color: black38 }}
          label={
            <FormattedMessage id="projectMenuRelay.editProject" defaultMessage="Edit project" />
          }
        />
      </Can>
    );
  }
}

ProjectMenu.contextTypes = {
  store: React.PropTypes.object,
};

const ProjectMenuContainer = Relay.createContainer(ProjectMenu, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id,
        dbid,
        title,
        description,
        permissions,
        get_slack_channel,
        team {
          id,
          dbid,
          slug,
          permissions,
          limits,
          get_slack_notifications_enabled
        }
      }
    `,
  },
});

class ProjectMenuRelay extends Component {
  render() {
    if (this.props.params && this.props.params.projectId) {
      const route = new ProjectRoute({ contextId: this.props.params.projectId });
      return <Relay.RootContainer Component={ProjectMenuContainer} route={route} />;
    }
    return null;
  }
}

export default ProjectMenuRelay;
