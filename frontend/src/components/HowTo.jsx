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
                  To recall what you did over the months so you can prepare for
                  a performance review (or plan your exit accordingly ;))
                </li>
                <li>
                  To pick up where you left off in solving an old problem/bug
                  (So make sure to save your relevant tabs to a given work day!)
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
                  Hi, My name is Kuda Mwakutuya. I made this app because I felt
                  a sense of dis-ease about how many months could go by at work
                  with little hard proof of what I've been up to this whole
                  time. This app gives you that security to say "Okay, I have
                  been working hard. Look at what I was involved in each day."
                  Use it to prepare for your performance reviews. If you've been
                  pulling in your tabs each day, use it to hop back into a old
                  problem you were solving. Ultimately, use it to give yourself
                  peace of mind that you've not just been lollygagging at work
                  all day. Many people have personal diaries...you spend most of
                  your waking hours working...Why wouldn't it be good to have a
                  Work Diary then? Of course it would be. Let me know how it
                  goes. ✌
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
      </div>
    </div>
  );
};

export default HowTo;
