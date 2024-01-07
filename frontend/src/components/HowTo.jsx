import React from "react";
import ContactForm from "./ContactForm";
const HowTo = ({ closeHowToModal }) => {
  return (
    <div className="container">
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              <h5>How to use the app</h5>
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="panelsStayOpen-headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <ol>
                <li>
                  You can't use the app in the browser (at least for now).
                  Please click{" "}
                  <a href="https://twitter.com/kuda2012_" target="_blank">
                    here
                  </a>{" "}
                  to download the chrome extension.
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo"
            >
              <h5>Why use this app?</h5>
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <ul>
                <li>
                  To pick up where you left off in solving an old problem/bug
                  (So make sure to save your relevant tabs to a given work day!)
                </li>
                <li>
                  To recall what you did over the months so you can prepare for
                  a performance review
                </li>
                <li>
                  To recall how you truly feel about your employment at a given
                  company and plan your exit accordingly ;)
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseThree"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseThree"
            >
              <h5>Who are we?</h5>
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="row">
                <div className="col text-center">
                  Hi, My name is Kuda Mwakutuya. I made this app because as a
                  Software engineer, each day when I would open my laptop to
                  start work, I felt like it was a disorganized hassle to
                  remember where I left from yesterday. Too many open tabs, no
                  recall of what I did yesterday, etc. Another reasons is that
                  it would be time for performance reviews or 1 on 1's with my
                  manager, and I would feel like I had done so much work over
                  the months but had no proof to show for it. Like sure, I added
                  a feature to the app, but there was a buttload of work that
                  went into making that. Where's the evidence for all of this
                  backend work ?? This app will help you to be prepared to show
                  up for yourself
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
    </div>
  );
};

export default HowTo;
