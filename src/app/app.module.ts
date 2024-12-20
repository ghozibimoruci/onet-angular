import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { MatIconModule } from "@angular/material/icon";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MatIconModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
