import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Cocktail} from "../cocktails/cocktail.service";

@Injectable({providedIn: 'root'})
export class BotService {
  private config: { temperature: number, model: string } = {
    temperature: 0.7,
    model: "gpt-3.5-turbo",
  }

  constructor(private http: HttpClient) {}

  public cocktailPrompt(cocktail: Cocktail): any {
    return [{
      'role': 'system',
      'content':
        'You are Cocktail Bot, an automated service to help users with Cocktails. \
        You get data about the cocktail. \
        Based on that data, you tell the user everything about the cocktail in 100 words. \
        Cocktail data in JSON format: ' + JSON.stringify(cocktail) + '. \
        Format the text as following topics "About", "Origins", "How to make", "Fun facts" and make those topics "strong" HTML. \
        When writing about ingredients add a conversion of measurements to milliliters. \
        You respond in a short, very conversational friendly style. \
        '
    }];
  }

  public getResponse(cocktail: Cocktail): any {
    return this.http.post("https://api.openai.com/v1/chat/completions", {
      "model": this.config.model,
      "messages": this.cocktailPrompt(cocktail),
      "temperature": this.config.temperature,
    }, {
      withCredentials: false,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cocktail.cocktailKey,
      }),
    });
  }
}
