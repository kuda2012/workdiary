import "../styles/HowTo.css";
import ContactForm from "./ContactForm";

const HowTo = ({ closeHowToModal }) => {
  return (
    <div class="accordion" id="accordionExample">
      <div class="accordion-item" id="accordion-top-item">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button"
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
          class="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <ol>
              <li>
                Record a voice note of how your work day went (or just type it
                out)
              </li>
              <li>
                Archive your browser tabs for today (delete the ones that don't
                have to do with today's work)
              </li>
              <li>
                Set up your in-app reminder to come back tomorrow (it's already
                pre-set for 5pm)
                <ul>
                  <li clas>
                    <b>Note: </b>Turn on your <i>both</i> Google Chrome
                    notifications in your Computer's system settings to allow
                    for the reminder notification to come through. This is very
                    important to remember to come back everyday. I promise it
                    won't be annoying and you can easily turn it off if you
                    want.
                  </li>
                </ul>
              </li>
              <li>That's it! Run it back tomorrow 🤝</li>
            </ol>
          </div>
        </div>
      </div>
      <div class="accordion-item" id="accordion-middle-item">
        <h2 class="accordion-header" id="headingTwo">
          <button
            class="accordion-button collapsed"
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
          class="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
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
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingThree">
          <button
            class="accordion-button collapsed"
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
          class="accordion-collapse collapse"
          aria-labelledby="headingThree"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
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
                hours working...Why wouldn't it be good to have a Work Diary
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
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingFour">
          <button
            class="accordion-button collapsed"
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
          class="accordion-collapse collapse"
          aria-labelledby="headingFour"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <div className="row">
              <div className="col">
                <ContactForm closeHowToModal={closeHowToModal} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
