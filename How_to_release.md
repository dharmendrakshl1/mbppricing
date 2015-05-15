# How to release #

  1. Update changelog with the date of the new release
  1. Run `mvn release:prepare -Prelease,dist -DautoVersionSubmodules=true`
    1. Use SCM label rest-assured-X
    1. If build fails because of missing dependencies do:
      1. `mvn install -Prelease,dist`
      1. `mvn release:prepare -Prelease,dist -Dresume`
  1. Run `mvn release:perform -Prelease,dist`
  1. Log in to [Sonatype](https://oss.sonatype.org).
  1. Follow the [Sonatype release directions](https://docs.sonatype.org/display/Repository/Sonatype+OSS+Maven+Repository+Usage+Guide) in bullet 8.
    * Remove all dist projects
    * If sonatype complains about missing javadoc from scalatra, remove the scaltra-example project from the sonatype browser
  1. Upload the artifacts to [bintray](http://bintray.com).
    1. Run the `./deploy_bintray.sh` script and enter the API Key (found on Bintray on the user profile page when pressing the edit button) and version to release.
    1. Login to [bintray](http://bintray.com) and add release notes and publish the release.
  1. Upload the javadoc to googlecode:
    1. Checkout the newly released version in git (`git co <version_tag>`)
    1. Run `mvn  clean javadoc:aggregate`
    1. Copy everything from REST Assured `target/site/apidocs` into `tags/X/apidocs` (in svn)
    1. Run `svn add X"
    1. Run `find . -name '*.html' | xargs svn propset svn:mime-type text/html`
    1. Run `find . -name '*.css' | xargs svn propset svn:mime-type text/css`
    1. svn ci -m "Uploading javadocs for version X"
  1. Update the front page, usage page, download page and the getting started page.
  1. Send a message to the mailing-list and twitter announcing the new release.

The release is automatically synced to Maven central (the sync process runs hourly).