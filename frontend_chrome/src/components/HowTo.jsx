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
          <div className="accordion-body">
            <iframe
              id="demo-video"
              width="550" // Adjust width and height as needed
              height="375"
              src={`https://www.youtube.com/embed/EEvQ04kS4Hk`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <div className="mt-1">
              <b>Note:</b> Your Computer's settings → Notifications → Turn on
              your Notifications for Google Chrome so you can be reminded to
              make an entry at the end of your workday!
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item" id="accordion-middle-item">
        <h2 className="accordion-header" id="headingTwo">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            <h5>Why use this app?</h5>
          </button>
        </h2>
        <div
          id="collapseTwo"
          className="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <ul>
              <li>
                To recall what you did over the months so you can prepare for a
                performance review (or plan your exit accordingly ;)
              </li>
              <li>
                To pick up where you left off in solving an old problem/bug (So
                make sure to save your relevant tabs to a given work day!)
              </li>
            </ul>
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
            <h5>Who are we?</h5>
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
              <div className="col text-center">
                Hi, My name is Kuda Mwakutuya. I made this app because I felt a
                sense of dis-ease about how many months could go by at work with
                little hard proof of what I've been up to this whole time. This
                app gives you that security to say "Okay, I have been working
                hard. Look at what I was involved in each day." Use it to
                prepare for your performance reviews. If you've been pulling in
                your tabs each day, use it to hop back into a old problem you
                were solving. Ultimately, use it to give yourself peace of mind
                that you've not just been lollygagging at work all day. Many
                people have personal diaries...you spend most of your waking
                hours working...Why wouldn't it be good to have a Workdiary
                then? Of course it would be. Let me know how it goes. ✌
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
                  <img src="linkedin.png" alt="Social Media 2" />
                  My LinkedIn
                </a>
              </div>
              <div className="col-auto">
                <a
                  href="https://www.buymeacoffee.com/kudamwakutuya"
                  target="_blank"
                >
                  <img src="coffee.png" alt="Social Media 2" />
                  Buy me a coffee
                </a>
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
            <h5>Contact</h5>
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
              <div className="col">
                <ContactForm closeHowToModal={closeHowToModal} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingFive">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseFive"
            aria-expanded="false"
            aria-controls="collapseFive"
          >
            <h5>Privacy Policy</h5>
          </button>
        </h2>
        <div
          id="collapseFive"
          className="accordion-collapse collapse"
          aria-labelledby="headingFive"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <div className="row">
              <div className="col" id="privacy-policy">
                <h2>Privacy Policy of Workdiary</h2>

                <p>The owner operates the Workdiary.me chrome extension</p>

                <p>
                  This page is used to inform website visitors regarding our
                  policies with the collection, use, and disclosure of Personal
                  Information if anyone decided to use our app, the Workdiary
                  website.
                </p>

                <p>
                  If you choose to use our app, then you agree to the collection
                  and use of information in relation with this policy. The
                  Personal Information that we collect are used for providing
                  and improving the app. We will not use or share your
                  information with anyone except as described in this Privacy
                  Policy.
                </p>

                <p>
                  The terms used in this Privacy Policy have the same meanings
                  as in our Terms and Conditions, which is accessible at
                  Workdiary.me, unless otherwise defined in this Privacy Policy.
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

                <h2>Cookies</h2>

                <p>
                  Cookies are files with small amount of data that is commonly
                  used an anonymous unique identifier. These are sent to your
                  browser from the website that you visit and are stored on your
                  computer's hard drive.
                </p>

                <p>
                  Our website uses these "cookies" to collection information and
                  to improve our app. You have the option to either accept or
                  refuse these cookies, and know when a cookie is being sent to
                  your computer. If you choose to refuse our cookies, you may
                  not be able to use some portions of our app.
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
                  We value your trust in providing us your Personal Information,
                  thus we are striving to use commercially acceptable means of
                  protecting it. But remember that no method of transmission
                  over the internet, or method of electronic storage is 100%
                  secure and reliable, and we cannot guarantee its absolute
                  security.
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
                  able to do necessary actions.
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
                  If you have any questions or suggestions about our Privacy
                  Policy, do not hesitate to contact us.
                  <a href="mailto:contact@workdiary.me">Contact@workdiary.me</a>
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
