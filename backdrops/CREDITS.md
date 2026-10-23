# Backdrop photographs

Background images for the app. Tampa Bay rotates through the repository
owner's own photographs; the Tar River image comes from Wikimedia Commons
under a licence that permits redistribution and is attributed below as that
licence requires. All are resized and re-encoded, with EXIF dropped.

| File | Location | Licence | Author | Source |
| --- | --- | --- | --- | --- |
| `tampa/tampa-1..4.jpg` | St. Petersburg / Tampa Bay | Owner's own photographs | Ryan (repository owner) | n/a |
| `tar-river.jpg` | Washington, NC | Public domain | U.S. Department of Agriculture | [Commons](https://commons.wikimedia.org/wiki/File:Tar_River_next_to_East_Carolina_University_in_Greenville,_North_Carolina.jpg) |

To change the Tampa Bay set, drop JPEGs into `backdrops/tampa/` and list them
in that location's `backdrop` array in index.html. Several images rotate every
15 seconds, shuffled; a single image just sits there.
