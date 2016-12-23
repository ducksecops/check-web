import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';

class CreateStatusMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation createStatus {
      createStatus
    }`;
  }

  getFatQuery() {
    let query = '';
    switch (this.props.parent_type) {
    case 'source':
      query = Relay.QL`fragment on CreateStatusPayload { statusEdge, source { annotations, id } }`;
      break;
    case 'media':
      query = Relay.QL`fragment on CreateStatusPayload { statusEdge, media { annotations, id, last_status, annotations_count } }`;
      break;
    }
    return query;
  }

  getOptimisticResponse() {
    const status = {
      id: this.props.id,
      created_at: new Date().toString(),
      annotation_type: 'status',
      permissions: '{"destroy Annotation":true,"destroy Status":true}',
      content: JSON.stringify({ status: this.props.annotation.status }),
      status: this.props.annotation.status,
      annotated_id: this.props.annotation.annotated_id,
      annotator: {
        name: this.props.annotator.name,
        profile_image: this.props.annotator.profile_image
      },
      medias: {
        edges: []
      }
    };

    const media = Object.assign({}, this.props.annotated);
    media.last_status = this.props.annotation.status;
    
    return { statusEdge: { node: status }, media };
  }

  getVariables() {
    const status = this.props.annotation;
    const vars = { status: status.status, annotated_id: `${status.annotated_id}`, annotated_type: status.annotated_type };
    const context = this.props.context;
    if (context && context.project) {
      vars.context_type = 'Project';
      vars.context_id = context.project.dbid.toString();
    }
    return vars;
  }

  getConfigs() {
    const fieldIds = {};
    fieldIds[this.props.parent_type] = this.props.annotated.id;

    return [
      {
        type: 'RANGE_ADD',
        parentName: this.props.parent_type,
        parentID: this.props.annotated.id,
        connectionName: 'annotations',
        edgeName: 'statusEdge',
        rangeBehaviors: (calls) => {
          return 'prepend';
        },
      },
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: fieldIds,
      },
    ];
  }
}

export default CreateStatusMutation;
