import styled from '@emotion/styled';
import {motion, Variants} from 'framer-motion';
import {PlatformIcon} from 'platformicons';

import platforms from 'sentry/data/platforms';
import {IconCheckmark} from 'sentry/icons';
import {t} from 'sentry/locale';
import pulsingIndicatorStyles from 'sentry/styles/pulsingIndicator';
import space from 'sentry/styles/space';
import {Project} from 'sentry/types';
import testableTransition from 'sentry/utils/testableTransition';
import withProjects from 'sentry/utils/withProjects';

type Props = {
  checkProjectHasFirstEvent: (project: Project) => boolean;
  projects: Project[];
  setNewProject: (newProjectId: string) => void;
  activeProject?: Project;
};
function Sidebar({
  projects,
  activeProject,
  setNewProject,
  checkProjectHasFirstEvent,
}: Props) {
  const oneProject = (project: Project) => {
    const name = platforms.find(p => p.id === project.platform)?.name ?? '';
    const isActive = activeProject?.id === project.id;
    const errorReceived = checkProjectHasFirstEvent(project);
    return (
      <ProjectWrapper
        key={project.id}
        isActive={isActive}
        onClick={() => setNewProject(project.id)}
      >
        <PlatformIcon platform={project.platform || 'other'} size={36} />
        <MiddleWrapper>
          <NameWrapper>{name}</NameWrapper>
          <SubHeader errorReceived={errorReceived} data-test-id="sidebar-error-indicator">
            {errorReceived ? t('Error Received') : t('Waiting for error')}
          </SubHeader>
        </MiddleWrapper>
        {errorReceived ? (
          <StyledIconCheckmark isCircled color="green400" />
        ) : (
          isActive && <WaitingIndicator />
        )}
      </ProjectWrapper>
    );
  };
  return (
    <Wrapper>
      <Title>{t('Projects to Setup')}</Title>
      {projects.map(oneProject)}
    </Wrapper>
  );
}

export default withProjects(Sidebar);

const Title = styled('span')`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: ${space(2)};
`;

const ProjectWrapper = styled('div')<{isActive: boolean}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${p => p.isActive && p.theme.gray100};
  padding: ${space(2)};
  cursor: pointer;
  border-radius: 4px;
`;

const SubHeader = styled('div')<{errorReceived: boolean}>`
  color: ${p =>
    p.errorReceived ? p.theme.successText : p.theme.charts.getColorPalette(5)[4]};
`;

const indicatorAnimation: Variants = {
  initial: {opacity: 0, y: -10},
  animate: {opacity: 1, y: 0},
  exit: {opacity: 0, y: 10},
};

const WaitingIndicator = styled(motion.div)`
  margin: 0 6px;
  flex-shrink: 0;
  ${pulsingIndicatorStyles};
  background-color: ${p => p.theme.charts.getColorPalette(5)[4]};
`;
const StyledIconCheckmark = styled(IconCheckmark)`
  flex-shrink: 0;
`;

WaitingIndicator.defaultProps = {
  variants: indicatorAnimation,
  transition: testableTransition(),
};

const MiddleWrapper = styled('div')`
  margin: 0 ${space(1)};
  flex-grow: 1;
  overflow: hidden;
`;

const NameWrapper = styled('div')`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// the number icon will be space(2) + 30px to the left of the margin of center column
// so we need to offset the right margin by that much
// also hide the sidebar if the screen is too small
const Wrapper = styled('div')`
  margin: ${space(1)} calc(${space(2)} + 30px + ${space(4)}) 0 ${space(2)};
  @media (max-width: 1150px) {
    display: none;
  }
  flex-basis: 240px;
  flex-grow: 0;
  flex-shrink: 0;
  min-width: 240px;
`;
