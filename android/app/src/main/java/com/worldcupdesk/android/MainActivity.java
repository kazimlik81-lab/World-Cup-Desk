package com.worldcupdesk.android;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import java.util.HashSet;
import java.util.Set;

public final class MainActivity extends Activity {
    private static final String USER_AGENT_SUFFIX = " WorldCupDeskAndroid/0.1";

    private final Set<String> internalHosts = new HashSet<>();
    private WebView webView;
    private ProgressBar progressBar;
    private LinearLayout errorView;
    private TextView errorMessageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Uri siteUri = Uri.parse(BuildConfig.WORLD_CUP_DESK_SITE_URL);
        registerInternalHosts(siteUri.getHost());

        FrameLayout rootView = new FrameLayout(this);
        webView = new WebView(this);
        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        errorView = buildErrorView();

        rootView.addView(webView, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        FrameLayout.LayoutParams progressLayoutParams = new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            dp(3)
        );
        progressLayoutParams.gravity = Gravity.TOP;
        rootView.addView(progressBar, progressLayoutParams);

        rootView.addView(errorView, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        setContentView(rootView);
        configureWebView();

        if (savedInstanceState == null) {
            webView.loadUrl(BuildConfig.WORLD_CUP_DESK_SITE_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }

        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }

        super.onDestroy();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUserAgentString(settings.getUserAgentString() + USER_AGENT_SUFFIX);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                progressBar.setVisibility(newProgress >= 100 ? View.GONE : View.VISIBLE);
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleNavigation(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleNavigation(Uri.parse(url));
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                showWebView();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    showError("World Cup Desk is unavailable. Check the connection or configured site URL.");
                }
            }
        });
    }

    private LinearLayout buildErrorView() {
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setGravity(Gravity.CENTER);
        container.setPadding(dp(28), dp(28), dp(28), dp(28));
        container.setBackgroundColor(getColor(R.color.surface));
        container.setVisibility(View.GONE);

        TextView titleView = new TextView(this);
        titleView.setText(R.string.error_title);
        titleView.setTextColor(getColor(R.color.text_primary));
        titleView.setTextSize(22);
        titleView.setGravity(Gravity.CENTER);

        errorMessageView = new TextView(this);
        errorMessageView.setText(R.string.error_message);
        errorMessageView.setTextColor(getColor(R.color.text_muted));
        errorMessageView.setTextSize(15);
        errorMessageView.setGravity(Gravity.CENTER);
        errorMessageView.setPadding(0, dp(12), 0, dp(18));

        Button retryButton = new Button(this);
        retryButton.setText(R.string.retry);
        retryButton.setAllCaps(false);
        retryButton.setOnClickListener(view -> {
            showWebView();
            webView.loadUrl(BuildConfig.WORLD_CUP_DESK_SITE_URL);
        });

        container.addView(titleView, new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        container.addView(errorMessageView, new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        container.addView(retryButton, new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        return container;
    }

    private boolean handleNavigation(Uri targetUri) {
        String scheme = targetUri.getScheme();

        if ("http".equals(scheme) || "https".equals(scheme)) {
            if (isInternalHost(targetUri.getHost())) {
                return false;
            }

            openExternalUrl(targetUri);
            return true;
        }

        openExternalUrl(targetUri);
        return true;
    }

    private boolean isInternalHost(String host) {
        return host != null && internalHosts.contains(host);
    }

    private void registerInternalHosts(String configuredHost) {
        if (configuredHost != null) {
            internalHosts.add(configuredHost);
        }

        internalHosts.add("10.0.2.2");
        internalHosts.add("localhost");
        internalHosts.add("127.0.0.1");
    }

    private void openExternalUrl(Uri targetUri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, targetUri));
        } catch (ActivityNotFoundException ignored) {
            showError("No installed app can open this link.");
        }
    }

    private void showWebView() {
        webView.setVisibility(View.VISIBLE);
        errorView.setVisibility(View.GONE);
    }

    private void showError(String message) {
        errorMessageView.setText(message);
        webView.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.VISIBLE);
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
