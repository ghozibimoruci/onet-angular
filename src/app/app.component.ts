import { Component } from "@angular/core";
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  beginnerIcons = [
    "face",
    "favorite",
    "star",
    "check_circle",
    "pets",
    "lightbulb",
    "thumb_up",
    "cake",
  ];
  intermediateIcons = [
    "local_florist",
    "sports_soccer",
    "beach_access",
    "camera_alt",
    "directions_car",
    "flight",
    "music_note",
    "shopping_cart",
    "school",
    "cake",
    "sports_basketball",
    "local_cafe",
  ];
  hardIcons = [
    "bolt",
    "extension",
    "filter_vintage",
    "emoji_nature",
    "headset",
    "healing",
    "public",
    "nightlight_round",
    "emoji_food_beverage",
    "airplanemode_active",
    "spa",
    "palette",
    "local_fire_department",
    "science",
    "hiking",
    "sailing",
  ];
  gameSize: number = null;
  gamesArray: {
    selected: boolean;
    iconName: string;
  }[][] = [];
  iconPairSelected: {
    indexArray: number;
    indexIcon: number;
    iconName: string;
  }[] = [];

  formattedTime: string = "00:00";
  initialRemainingTime = 300;
  private remainingTime: number = 300; // Set initial time in seconds
  private timerSubscription!: Subscription;

  selectLevel(levelSize: number) {
    this.gameSize = levelSize;
    this.generateGamesTile();
    this.startTimer();
  }

  generateGamesTile() {
    this.gamesArray = [];
    let gamesArrayToBe: string[] = [];
    for (let i = 0; i < this.gameSize; i++) {
      gamesArrayToBe = gamesArrayToBe.concat(this.shuffleArray());
    }
    for (let i = 0; i < this.gameSize; i++) {
      const gamesArrayPerItem = [];
      for (let j = 0; j < this.gameSize; j++) {
        const randomIndex = this.getRandomNumber(0, gamesArrayToBe.length - 1);
        gamesArrayPerItem.push({
          selected: false,
          iconName: gamesArrayToBe[randomIndex],
        });
        gamesArrayToBe.splice(randomIndex, 1);
      }
      this.gamesArray.push(gamesArrayPerItem);
    }
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffleArray(): string[] {
    let array: string[] = [];
    switch (this.gameSize) {
      case 8:
        array = this.beginnerIcons;
        break;
      case 12:
        array = this.intermediateIcons;
        break;
      case 16:
        array = this.hardIcons;
        break;
    }
    const shuffled = [...array]; // Create a copy of the array to avoid mutating the original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1)); // Get a random index
      [shuffled[i], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[i],
      ]; // Swap elements
    }
    return shuffled;
  }

  selectIcon(indexArray: number, indexIcon: number) {
    if (this.gamesArray[indexArray][indexIcon].selected) {
      // do nothing on selected icons
      return;
    }
    if (this.iconPairSelected.length == 2) {
      if (
        this.iconPairSelected[0].iconName != this.iconPairSelected[1].iconName
      ) {
        this.iconPairSelected.forEach((item) => {
          this.gamesArray[item.indexArray][item.indexIcon].selected = false;
        });
      }
      this.iconPairSelected = [];
    }
    this.iconPairSelected.push({
      indexArray: indexArray,
      indexIcon: indexIcon,
      iconName: this.gamesArray[indexArray][indexIcon].iconName,
    });
    this.gamesArray[indexArray][indexIcon].selected = true;
    if (this.iconPairSelected.length == 2) {
      if (
        this.gamesArray.every((array) => array.every((icon) => icon.selected))
      ) {
        setTimeout(() => {
          this.winTheGame();
        }, 100);
      }
    }
  }

  resetGame() {
    this.gamesArray = [];
    this.gameSize = null;
    this.iconPairSelected = [];
  }

  winTheGame() {
    alert("Congratulations! You win!");
    this.resetGame();
    this.remainingTime = this.initialRemainingTime;
  }

  loseTheGame() {
    alert("Game Over");
    this.resetGame();
    this.remainingTime = this.initialRemainingTime;
  }

  startTimer(): void {
    this.updateDisplay();

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.updateDisplay();
      } else {
        this.stopTimer();
        if (
          this.gamesArray.some((array) => array.some((icon) => !icon.selected))
        ) {
          this.loseTheGame();
        }
      }
    });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  resetTimer(): void {
    this.stopTimer();
    this.startTimer();
  }

  private updateDisplay(): void {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    this.formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }
}
