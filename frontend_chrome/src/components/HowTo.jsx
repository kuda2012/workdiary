import React from "react";
import Alarm from "./Alarm";
import UserAccountInfo from "./UserAccountInfo";

const HowTo = () => {
  return (
    <div className="container">
      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="panelsStayOpen-headingOne">
            <button
              class="accordion-button"
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
            class="accordion-collapse collapse show"
            aria-labelledby="panelsStayOpen-headingOne"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <ol>
                <li>
                  Record a voice note of how your work day went (or just type it
                  out). You can speak how you normally would, it will add
                  punctuation.
                </li>
                <li>
                  Click the green button to have your voice turned into text
                </li>
                <li>Add a tag to your note</li>
                <li>
                  Pull your tabs for today (delete the ones you don't want to
                  keep)
                </li>
                <li>
                  Set your alarm so you can remember to come back tomorrow (it's
                  already pre-set for 5pm)
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
            <button
              class="accordion-button collapsed"
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
            class="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
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
        <div class="accordion-item">
          <h2 class="accordion-header" id="panelsStayOpen-headingThree">
            <button
              class="accordion-button collapsed"
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
            class="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingThree"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
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
      </div>
    </div>
  );
};

export default HowTo;
