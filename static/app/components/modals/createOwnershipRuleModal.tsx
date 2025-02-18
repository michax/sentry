import {Fragment, useCallback, useEffect, useRef} from 'react';
import {css} from '@emotion/react';

import {ModalRenderProps} from 'sentry/actionCreators/modal';
import {t} from 'sentry/locale';
import theme from 'sentry/utils/theme';
import ProjectOwnershipModal from 'sentry/views/settings/project/projectOwnership/modal';

type Props = ModalRenderProps &
  Pick<ProjectOwnershipModal['props'], 'organization' | 'project' | 'issueId'> & {
    onClose?: () => void;
  };

const CreateOwnershipRuleModal = ({Body, Header, closeModal, ...props}: Props) => {
  const closeModalTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeModalTimeoutRef.current) {
        window.clearInterval(closeModalTimeoutRef.current);
      }
    };
  }, []);

  const handleSuccess = useCallback(() => {
    props.onClose?.();
    closeModalTimeoutRef.current = window.setTimeout(closeModal, 2000);
  }, [props.onClose]);

  return (
    <Fragment>
      <Header closeButton>{t('Create Ownership Rule')}</Header>
      <Body>
        <ProjectOwnershipModal {...props} onSave={handleSuccess} />
      </Body>
    </Fragment>
  );
};

export const modalCss = css`
  @media (min-width: ${theme.breakpoints[0]}) {
    width: 80%;
  }
  [role='document'] {
    overflow: initial;
  }
`;

export default CreateOwnershipRuleModal;
