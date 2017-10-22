import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import rtlDetect from 'rtl-detect';
import AccountChips from './AccountChips';
import ParsedText from '../ParsedText';
import MediaUtil from '../media/MediaUtil';
import { truncateLength } from '../../helpers';
import SourcePicture from './SourcePicture';

import {
  StyledContactInfo,
  StyledTwoColumns,
  StyledSmallColumn,
  StyledBigColumn,
  StyledName,
  StyledDescription,
} from '../../styles/js/HeaderCard';

class UserInfo extends React.Component {
  render() {
    const { user } = this.props;

    return (
      <StyledTwoColumns>
        <StyledSmallColumn isRtl={rtlDetect.isRtlLang(this.props.intl.locale)}>
          <SourcePicture
            size="large"
            object={user.source}
            type="user"
            className="source__avatar"
          />
        </StyledSmallColumn>

        <StyledBigColumn>
          <div className="source__primary-info">
            <StyledName className="source__name">
              {user.name}
            </StyledName>
            <StyledDescription>
              <p>
                <ParsedText text={truncateLength(user.source.description, 600)} />
              </p>
            </StyledDescription>
          </div>

          <AccountChips
            accounts={user.source.account_sources.edges.map(as => as.node.account)}
          />

          <StyledContactInfo>
            <FormattedHTMLMessage
              id="UserInfo.dateJoined"
              defaultMessage="Joined {date} &bull; {teamsCount, plural, =0 {No teams} one {1 team} other {# teams}}"
              values={{
                date: this.props.intl.formatDate(
                  MediaUtil.createdAt({ published: user.source.created_at }),
                  { year: 'numeric', month: 'short', day: '2-digit' },
                ),
                teamsCount: user.team_users.edges.length || 0,
              }}
            />
          </StyledContactInfo>

        </StyledBigColumn>
      </StyledTwoColumns>
    );
  }
}

export default injectIntl(UserInfo);
