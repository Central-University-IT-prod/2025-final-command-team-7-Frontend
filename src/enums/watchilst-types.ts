/**
 * Тип watchlist (списка фильмов).
 * Может быть одним из следующих значений:
 * - Liked — список понравившихся фильмов.
 * - Wish — список желаемых фильмов.
 * - Watched — список просмотренных фильмов.
 */
export enum WatchlistType {
  Liked = "liked",
  Wish = "wish",
  Watched = "watched",
}
