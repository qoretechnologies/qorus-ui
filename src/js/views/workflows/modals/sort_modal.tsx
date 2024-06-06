import withHandlers from 'recompose/withHandlers';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { ReqoreButton, ReqoreControlGroup, ReqoreModal } from '@qoretechnologies/reqore';
import { ORDER_STATES } from '../../../constants/orders';

type Props = {
  closeModal: () => void;
  sortData: any;
  onSortChange: Function;
  handleSortClick: Function;
};

const SortModal: Function = ({ closeModal, sortData, handleSortClick }: Props): any => (
  <ReqoreModal label="Sort workflow instances" isOpen onClose={closeModal} width="500px" fluid>
      <ReqoreControlGroup vertical fluid>
        {ORDER_STATES.map((state: any): any => (
          <ReqoreButton
            onClick={() => handleSortClick(state.name)}
            label={state.name}
            intent={sortData.sortBy === state.name ? 'success' : undefined}
          />
        ))}
      </ReqoreControlGroup>
  </ReqoreModal>
);

export default withHandlers({
  handleSortClick:
    ({ onSortChange, closeModal }: Props): Function =>
    (name: string): void => {
      onSortChange({ sortBy: name });
      closeModal();
    },
})(SortModal);
