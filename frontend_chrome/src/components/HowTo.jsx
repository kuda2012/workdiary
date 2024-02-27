import ContactForm from "./ContactForm";
import "../styles/HowTo.css";

const HowTo = ({ closeHowToModal }) => {
  return (
    <div className="accordion" id="accordionExample">
      <div className="accordion-item" id="accordion-top-item">
        <h2 className="accordion-header" id="headingOne">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            <h5>How to use the app</h5>
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body p-0" id="accordion-body-tour-video">
            <h5 id="tour-title" className="my-1 p-0">
              Very helpful tour. Open in fullscreen to see best.
            </h5>
            <iframe
              id="demo-video"
              src={`https://www.youtube.com/embed/VD8XPD7ldHs`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={true}
            ></iframe>
            <div className="mt-1 text-center">
              <b class="stronger-bold">Checklist: </b> <br></br>
              <ul>
                <li className="shrink-text-accordion-body">
                  Pin the Workdiary Icon to your toolbar for optimal access
                  <img src="./pin_instruction.png" alt="Pin instructions"></img>
                </li>
                <li className="shrink-text-accordion-body">
                  Go to your Computer's settings <span>→</span> Notifications{" "}
                  <span>→</span> Ensure your Notifications for Google Chrome are
                  on you can be reminded to make an entry at the end of your
                  workday!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingTwo">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            <h5>Okay...but why use this?</h5>
          </button>
        </h2>
        <div
          id="collapseTwo"
          className="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <div className="row">
              <div className="col text-center">
                Hey there, I made this app because I felt sense of unease about
                how many months could go by at work without much to account for
                what I had been up to the whole time. Then, when it would come
                time to apply for new jobs, I would sit there racking my brain
                trying to remember everything I had accomplished on the job, how
                I felt about this line of employment, etc. It just felt like
                Work was one big black box that I would show up to, participate
                in, and then leave from without any solid proof that anything
                meaningful had happened day to day. Given that work is such a
                fundamental aspect of our lives, I believe it's in our best
                interest to stay on top of what we tell ourselves about it. Let
                this app be a platform for you to develop a richer mental
                narrative of your work endeavors that will make you more
                compelling during job interviews, networking events, or anytime
                you get a chance to say your piece. Many people have personal
                diaries...you spend most of your waking hours working...Why
                wouldn't it be good idea to have a Workdiary then? Of course it
                would be. Let me know how it goes. Peace ✌
              </div>
            </div>
            <div className="row justify-content-around mt-2">
              <div className="col-auto">
                <a href="https://twitter.com/kuda2012_" target="_blank">
                  <img src="x.png" alt="Social Media 1" />
                  My X/Twitter
                </a>
              </div>
              <div className="col-auto">
                <a
                  href="https://www.linkedin.com/in/kuda-mwakutuya/"
                  target="_blank"
                >
                  <img src="linkedIn.png" alt="Social Media 2" />
                  My LinkedIn
                </a>
              </div>
              <div className="col-auto">
                <a
                  href="https://www.buymeacoffee.com/kudamwakutuya"
                  target="_blank"
                >
                  <img src="coffee.png" alt="Social Media 3" />
                  Buy me a coffee
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingThree">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseThree"
            aria-expanded="false"
            aria-controls="collapseThree"
          >
            <h5>Contact Us</h5>
          </button>
        </h2>
        <div
          id="collapseThree"
          className="accordion-collapse collapse"
          aria-labelledby="headingThree"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <div className="row">
              <div className="col">
                <ContactForm closeHowToModal={closeHowToModal} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingFour">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseFour"
            aria-expanded="false"
            aria-controls="collapseFour"
          >
            <h5>Privacy Policy</h5>
          </button>
        </h2>
        <div
          id="collapseFour"
          className="accordion-collapse collapse"
          aria-labelledby="headingFour"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <div className="row">
              <div className="col" id="privacy-policy">
                <h2>Privacy Policy of Workdiary</h2>

                <p>The owner operates the Workdiary.me Chrome Extension</p>

                <p>
                  This page is used to inform website visitors regarding our
                  policies with the collection, use, and disclosure of Personal
                  Information if anyone decided to use our app.
                </p>

                <p>
                  If you choose to use our app, then you agree to the collection
                  and use of information in relation with this policy. The
                  Personal Information that we collect are used for providing
                  and improving the app. We will not use or share your
                  information with anyone except as described in this Privacy
                  Policy.
                </p>

                <h2>Information Collection and Use</h2>

                <p>
                  For a better experience while using our app, we may require
                  you to provide us with certain personally identifiable
                  information, including but not limited to your name and email
                  address. The information that we collect will be used to
                  contact or identify you.
                </p>

                <h2>Log Data</h2>

                <p>
                  We want to inform you that whenever you visit our app, we
                  collect information that your browser sends to us that is
                  called Log Data. This Log Data may include information such as
                  your computer's Internet Protocol ("IP") address, browser
                  version, pages of our app that you visit, the time and date of
                  your visit, the time spent on those pages, and other
                  statistics.
                </p>

                <h2>App Providers</h2>

                <p>
                  We may employ third-party companies and individuals due to the
                  following reasons:
                </p>

                <ul>
                  <li>To facilitate our app</li>
                  <li>To provide the app on our behalf</li>
                  <li>To perform app-related services</li>
                  <li>To assist us in analyzing how our app is used.</li>
                </ul>

                <p>
                  We want to inform our app users that these third parties have
                  access to your Personal Information. The reason is to perform
                  the tasks assigned to them on our behalf. However, they are
                  obligated not to disclose or use the information for any other
                  purpose.
                </p>

                <h2>Security</h2>

                <p>
                  We value your trust in providing us with your Personal
                  Information, and we are committed to using commercially
                  acceptable means to protect it. However, it's important to
                  note that no method of transmission over the internet or
                  electronic storage is 100% secure and reliable. While we
                  strive to maintain the highest standards of security, we
                  cannot guarantee the absolute security of your data.
                </p>

                <h2>Children's Privacy</h2>

                <p>
                  Our apps do not address anyone under the age of 13. We do not
                  knowingly collect personal identifiable information from
                  children under 13. In the case we discover that a child under
                  13 has provided us with personal information, we immediately
                  delete this from our servers. If you are a parent or guardian
                  and you are aware that your child has provided us with
                  personal information, please contact us so that we will be
                  able to complete the necessary actions.
                </p>

                <h2>Changes to This Privacy Policy</h2>

                <p>
                  We may update our Privacy Policy from time to time. Thus, we
                  advise you to review this page periodically for any changes.
                  We will notify you of any changes by posting the new Privacy
                  Policy on this page. These changes are effective immediately
                  after they are posted on this page.
                </p>

                <h2>Contact Us</h2>

                <p>
                  If you have any questions about our Privacy Policy do not
                  hesitate to contact us:{" "}
                  <a href="mailto:contact@workdiary.me">contact@workdiary.me</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
