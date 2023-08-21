export const Avatar = (props) => {
  const { player } = props;
  return (
    <>
      <div className="avatar">
        <div
          className="avatar bg"
          style={{
            backgroundPosition: `${player[4]}% ${player[5]}% `,
          }}
        ></div>
        <div
          className="avatar eye"
          style={{
            backgroundPosition: `${player[0]}% ${player[1]}%`,
          }}
        ></div>
        <div
          className="avatar mouth"
          style={{
            backgroundPosition: `${player[2]}% ${player[3]}%`,
          }}
        ></div>
      </div>
    </>
  );
};
