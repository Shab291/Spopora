const Title = ({ title1, title2, para, title1Styles, paraStyles }) => {
  return (
    <div className={`${paraStyles}`}>
      <h2 className={`${title1Styles} medium-28`}>
        {title1}
        <span className="text-[#bc127e] !font-light underline">{title2}</span>
      </h2>
      <p className={`${paraStyles}`}>{para}</p>
    </div>
  );
};

export default Title;
