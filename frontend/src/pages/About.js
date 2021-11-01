import logo from "./../photos/logo.png";
import phone from "./../photos/phone.png";
import whatsapp from "./../photos/whatsapp.png";
import github from "./../photos/github.png";

import "./About.css";
function About(props) {
  return (
    <div className="about">
      <h1 className="pageTitle">About</h1>
      <div className="about__main">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris id
          felis urna. Phasellus congue, lorem nec efficitur mattis, elit mauris
          tincidunt arcu, a porttitor erat ipsum id nibh. Nunc laoreet erat et
          erat iaculis, ut imperdiet risus vehicula. Donec tempus, ligula quis
          consequat vestibulum, elit elit bibendum justo, ut egestas purus quam
          vel tortor. Morbi placerat purus egestas mauris feugiat condimentum.
          Nulla molestie ipsum sed quam ullamcorper, sit amet pellentesque justo
          fringilla. Curabitur nec iaculis lectus. Cras viverra quis urna sed
          varius. Suspendisse ac eros felis. Proin consectetur ante id diam
          iaculis, eu lacinia mauris venenatis. Mauris tempor odio et tincidunt
          mattis. Cras lectus justo, pellentesque ac mi sed, sollicitudin
          interdum tellus.
        </p>
        <img src={logo} alt="" />
        <div className="about__main__contact">
          <div className="about__main__contact-phone">
            <img src={phone} alt="" />
          </div>
          <div className="about__main__contact-whatsapp">
            <img src={whatsapp} alt="" />
          </div>
          <div className="about__main__contact-github">
            <img src={github} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
