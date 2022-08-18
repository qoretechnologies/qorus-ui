export interface ISpacerProps {
  size: number;
}

export default ({ size }: ISpacerProps) => (
  <div style={{ width: '1px', height: `${size}px`, flex: '0 auto', flexShrink: 0 }} />
);
