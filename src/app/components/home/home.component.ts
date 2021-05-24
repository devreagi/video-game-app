import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {APIResponse} from 'src/app/models/api-response';
import {Game} from 'src/app/models/game';
import {GameService} from 'src/app/services/game.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort!: string;
  public games: Array<Game> = [];
  private routeSub: Subscription = new Subscription;
  private gameSub: Subscription = new Subscription;


  constructor(
    private gameService: GameService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        this.searchGames('metacrit');
      }
    });
  }

  searchGames(sort: string, search?: string): void {
    this.gameSub = this.gameService
      .getGameList(sort, search)
      .subscribe((gameList: APIResponse<Game>) => {
        this.games = gameList.results;
      });
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
