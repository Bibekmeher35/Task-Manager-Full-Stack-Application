const Spinner = ({ size = 'default' }) => {
  return (
    <div className={`spinner ${size === 'lg' ? 'spinner-lg' : ''}`} />
  );
};

export default Spinner;
