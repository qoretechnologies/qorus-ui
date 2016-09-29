/* @flow */
import React from 'react';
import moment from 'moment';

import { sortTable } from 'helpers/table';
import checkNoData from '../../../hocomponents/check-no-data';

type Props = {
  notes: Array<Object>
}

const NotesList: Function = ({ notes }: Props): React.Element<any> => {
  const sortedNotes = sortTable(notes, {
    sortBy: 'created',
    sortByKey: {
      direction: -1,
    },
  });

  return sortedNotes.map((note, index) => (
    <p key={index} className="note">
      <time>{ moment(note.created).format('YYYY-MM-DD HH:mm:ss') }</time>
      {' '}
      <span className="label label-default">{ note.username }</span>
      {' '}
      <span>{ note.note }</span>
    </p>
  ));
};

export default checkNoData((props) => props.notes && props.notes.length)(NotesList);
