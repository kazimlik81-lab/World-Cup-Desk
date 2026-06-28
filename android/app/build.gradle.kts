import java.net.URI
import java.util.Properties

plugins {
    id("com.android.application")
}

val defaultSiteUrl = "https://world-cup-desk.example.com"
val siteUrl = providers.gradleProperty("worldCupDeskSiteUrl")
    .orElse(providers.environmentVariable("NEXT_PUBLIC_SITE_URL"))
    .orElse(defaultSiteUrl)
    .map(::requirePublicSiteUrl)
    .get()
val siteUri = URI(siteUrl)
val siteHost = siteUri.host ?: throw GradleException("worldCupDeskSiteUrl must include a host. Received: $siteUrl")
val allowsCleartextTraffic = siteUri.scheme == "http"
val keystoreProperties = loadKeystoreProperties(rootProject.file("keystore.properties"))
val hasReleaseSigning = listOf("storeFile", "storePassword", "keyAlias", "keyPassword").all {
    keystoreProperties.getProperty(it)?.isNotBlank() == true
}

android {
    namespace = "com.worldcupdesk.android"
    compileSdk = 37

    defaultConfig {
        applicationId = "com.worldcupdesk.android"
        minSdk = 26
        targetSdk = 37
        versionCode = 1
        versionName = "0.1.0"

        manifestPlaceholders["worldCupDeskHost"] = siteHost
        manifestPlaceholders["worldCupDeskUsesCleartextTraffic"] = allowsCleartextTraffic.toString()
        buildConfigField("String", "WORLD_CUP_DESK_SITE_URL", quoteBuildConfigString(siteUrl))
    }

    buildFeatures {
        buildConfig = true
    }

    signingConfigs {
        if (hasReleaseSigning) {
            create("release") {
                storeFile = rootProject.file(keystoreProperties.getProperty("storeFile"))
                storePassword = keystoreProperties.getProperty("storePassword")
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
            isDebuggable = true
        }

        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )

            if (hasReleaseSigning) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

fun requirePublicSiteUrl(rawUrl: String): String {
    val parsedUrl = URI(rawUrl)
    val scheme = parsedUrl.scheme
    val host = parsedUrl.host

    if (scheme == "https" && !host.isNullOrBlank()) {
        return parsedUrl.toString()
    }

    if (scheme == "http" && isLocalDevelopmentHost(host)) {
        return parsedUrl.toString()
    }

    throw GradleException("worldCupDeskSiteUrl must use HTTPS, except local emulator development hosts. Received: $rawUrl")
}

fun isLocalDevelopmentHost(host: String?): Boolean {
    return host == "localhost" || host == "127.0.0.1" || host == "10.0.2.2" || host == "::1"
}

fun quoteBuildConfigString(value: String): String {
    val escapedValue = value
        .replace("\\", "\\\\")
        .replace("\"", "\\\"")

    return "\"$escapedValue\""
}

fun loadKeystoreProperties(propertiesFile: File): Properties {
    val properties = Properties()

    if (propertiesFile.isFile) {
        propertiesFile.inputStream().use(properties::load)
    }

    return properties
}
