import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '@core';
import { ConfigService } from '@core';
import { ThemeService } from '@core';
import { SHARED_CONFIG } from './shared/shared.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SHARED_CONFIG],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('Wiseguy Investor');
  protected readonly year = new Date().getFullYear();

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  public auth = inject(AuthService);
  public _theme = inject(ThemeService);
  public config = inject(ConfigService);

  async ngOnInit() {
    // Set the default title initially
    const appConfig = await this.config.getApp();
    this.titleService.setTitle(appConfig.title);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      // this.isCollapsed = true;

      // Find the deepest activated route
      let route = this.route;
      while (route.firstChild) {
        route = route.firstChild;
      }
      const routeData = route.snapshot.data;
      const pageTitle = routeData['title'] ? `${routeData['title']} - ${appConfig.title}` : appConfig.title;
      this.titleService.setTitle(pageTitle);
    });

    this._theme.initThemeListener();
  }

  isView(name: string) {
    let path = this.route.pathFromRoot.join('/');
    path = path.substring(1, path.length).trim();
    return path.indexOf(name) > -1;
  }
}
