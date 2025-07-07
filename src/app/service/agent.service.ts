import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Analytics, logEvent } from "@angular/fire/analytics";

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(
    private router: Router,
    private analytics: Analytics 
  ) {}

  async logAnalyticsEvent(event: string, data: any) {
    let url = this.router.url.replace(/\/(sv|es-es|nb-no)/g, '');
    if (data.screen_type?.toLowerCase() === 'modal') {
      url = this.router.url + '/' + data.screen_id;
    }
    const pageTitle = data.screen_id.replace(/-/g, ' ').replace(/\b\w/g, (match: any) => match.toUpperCase());
    delete data.screen_type;

    logEvent(this.analytics, event, {
      // user: data.screen_user ? data.screen_user : 'guest',
      screen_name: pageTitle,
      page_path: url,
      ...data
    });
  }
}
