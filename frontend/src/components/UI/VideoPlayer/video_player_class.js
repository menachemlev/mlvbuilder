/*
This class is from another project I made. check my GitHub for VideoPlayer repository :)
*/
import { isItMobile } from "./../../Builder/util/generalFunctions";
export default class MediaPlayer {
  //Interval Time to update local storage
  #UPDATE_TIME = 7 * 1000;
  #DURATION = 0;
  //Video element
  #video = document.querySelector(".video");
  #playButton = document.querySelector(".play_button");
  #setIsPlaying;

  //Time bar control
  #time_progress = document.querySelector(".time_progress");
  #fill = document.querySelector(".fill");

  //Volume control
  #volume_metter = document.querySelector(".volume_metter");
  #volume = document.querySelector(".volume");

  //Hints
  #hints = document.querySelectorAll(".hint");
  #volumeup = document.querySelector(".volumeup");
  #volumedown = document.querySelector(".volumedown");
  #later = document.querySelector(".later");
  #sooner = document.querySelector(".sooner");

  //Object to store data about the video
  #videoParams;
  #videoTimeUpdaterInterval;
  #hideControlsTimeout;
  #hideHintsTimeout;

  //Initial parameters
  #initialParams = {
    volume: 0.2,
    play: false,
    time: 0,
    fillWidth: 0,
  };
  constructor(DURATION, setIsPlaying) {
    this.#DURATION = DURATION;
    this.#setIsPlaying = setIsPlaying;
    //For calling functions on events with parameters
    //const this = this;
    //Getting previous parameters from local storage or intiliazing local storage
    if (sessionStorage !== undefined)
      if (sessionStorage.videoParams) {
        this.#videoParams = JSON.parse(sessionStorage.videoParams);
      } else {
        this.#videoParams = this.#initialParams;
        sessionStorage.setItem("videoParams", "");
      }

    this._updateVideo();
    this._resettingHideControlsTimeout(3);
    this.#playButton.addEventListener("click", this._toggle.bind(this));
    if (!isItMobile()) {
      this.#video.addEventListener("click", this._toggle.bind(this));
    }
    this.#video.addEventListener("mousemove", () => {
      this._resettingHideControlsTimeout.call(this, 0.8);
    });
    window.addEventListener("keydown", (e) => {
      this._actionByKeyPress.call(this, e);
    });

    this.#time_progress.addEventListener("click", (e) => {
      this._updateTimeBar.call(this, e);
    });

    this.#volume_metter.addEventListener("click", (e) => {
      this._updateVolumeBar.call(this, e);
    });
  }

  //helpers

  _updateVolumeBar(e) {
    const volume_metter_sizes = this.#volume_metter.getBoundingClientRect();
    this.#videoParams.volume =
      (Number(volume_metter_sizes.bottom) - e.clientY) /
      Number(volume_metter_sizes.height);
    this._resettingHideControlsTimeout(2);
    this.#videoParams.time = this.#video.currentTime;
    //Updating
    this._updateVideo();
    this._updateStorage();
  }

  _updateTimeBar(e) {
    const time_progress_sizes = this.#time_progress.getBoundingClientRect();
    const percentage =
      (e.clientX - Number(time_progress_sizes.left)) /
      Number(time_progress_sizes.width);
    this.#videoParams.time = +this.#video.duration * percentage;
    this._resettingHideControlsTimeout(2);

    //Updating
    this._updateVideo();
    this._updateStorage();
  }

  //Hints functionallity
  _actionByKeyPress(e) {
    if (e.keyCode === 32) return this._toggle();
    if (e.keyCode === 37) {
      this.#videoParams.time = Math.max(this.#video.currentTime - 10, 0);
      this._updateVideo();
      this._updateStorage();
      this._handleHint(this.#sooner);
    }

    if (e.keyCode === 39) {
      this.#videoParams.time = Math.min(
        this.#video.currentTime + 10,
        this.#DURATION
      );
      this._updateVideo();
      this._updateStorage();
      this._handleHint(this.#later);
    }

    if (e.keyCode === 38) {
      this.#videoParams.volume = Math.min(this.#videoParams.volume + 0.05, 1);
      this._updateVideo();
      this._updateStorage();
      this._handleHint(this.#volumeup);
    }
    if (e.keyCode === 40) {
      this.#videoParams.volume = Math.max(this.#videoParams.volume - 0.05, 0);
      this._updateVideo();
      this._updateStorage();
      this._handleHint(this.#volumedown);
    }
    this._updateByPlaying();
    this._resettingHideControlsTimeout(0.8);
  }
  _hideHints() {
    this.#hints.forEach((hint) => {
      hint.style.display = "none";
    });
  }

  _handleHint = (hint) => {
    clearTimeout(this.#hideHintsTimeout);
    hint.style.display = "block";
    this.#hideHintsTimeout = setTimeout(this._hideHints.bind(this), 400);
  };

  //controlls handle
  _hideControls() {
    this.#playButton.style.display =
      this.#time_progress.style.display =
      this.#volume_metter.style.display =
        "none";
  }
  _showControls() {
    this.#playButton.style.display =
      this.#time_progress.style.display =
      this.#volume_metter.style.display =
        "block";
  }

  _resettingHideControlsTimeout(timeout) {
    clearTimeout(this.#hideControlsTimeout);
    this._showControls();
    this.#hideControlsTimeout = setTimeout(
      this._hideControls.bind(this),
      timeout * 1000
    );
  }

  //updators
  //Updating video and storage functionallity
  _updateByPlaying() {
    this.#videoParams.time = this.#video.currentTime;
    let percentage = (this.#videoParams.time / this.#DURATION) * 100;
    this.#fill.style.width = percentage + "%";
    this.#videoParams.fillWidth = percentage;
    this._updateStorage();
  }

  _updateVideo() {
    this.#video.volume = this.#videoParams.volume;
    this.#video.currentTime = this.#videoParams.time;
    //Updating time bar
    const percentage = (this.#videoParams.time / this.#DURATION) * 100;
    this.#fill.style.width = percentage + "%";
    this.#videoParams.fillWidth = percentage;

    this.#volume.style.height = this.#videoParams.volume * 100 + "%";
  }

  //Update sessionStorage
  _updateStorage() {
    sessionStorage.videoParams = JSON.stringify({
      ...this.#videoParams,
      play: false,
    });
  }

  //Video playing controll
  _playVideo() {
    this.#video.play();
    this.#videoParams.play = true;
    this._updateStorage();
    this.#videoTimeUpdaterInterval = setInterval(
      this._updateByPlaying.bind(this),
      this.#UPDATE_TIME
    );
    this.#setIsPlaying(true);
    this._resettingHideControlsTimeout(0.8);
  }
  _pauseVideo() {
    this.#video.pause();
    this.#videoParams.play = false;
    this._updateStorage();
    clearInterval(this.#videoTimeUpdaterInterval);
    this.#setIsPlaying(false);
    this._resettingHideControlsTimeout(3);
  }

  _toggle() {
    this.#videoParams.play === true ? this._pauseVideo() : this._playVideo();
  }
}
