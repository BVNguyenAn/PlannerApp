
import SwiftUI
import WebKit

final class WebCoordinator: NSObject, WKScriptMessageHandler {
    let webView: WKWebView
    init(webView: WKWebView) { self.webView = webView }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "requestData" {
            let json = Storage.loadJSON() ?? Storage.defaultJSON()
            let escaped = json.replacingOccurrences(of: "\\", with: "\\\\")
                              .replacingOccurrences(of: "\"", with: "\\\"")
                              .replacingOccurrences(of: "\n", with: "\\n")
            let js = "window.appProvideData(\"\(escaped)\");"
            webView.evaluateJavaScript(js, completionHandler: nil)
        } else if message.name == "saveData" {
            if let body = message.body as? String {
                Storage.saveJSON(body)
            }
        } else if message.name == "resetData" {
            Storage.deleteJSON()
        }
    }
}

struct WebContainer: UIViewRepresentable {
    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        let controller = WKUserContentController()
        config.userContentController = controller
        
        let webView = WKWebView(frame: .zero, configuration: config)
        let coordinator = WebCoordinator(webView: webView)
        controller.add(coordinator, name: "requestData")
        controller.add(coordinator, name: "saveData")
        controller.add(coordinator, name: "resetData")
        
        if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        } else {
            let html = "<h1>Không tìm thấy index.html</h1>"
            webView.loadHTMLString(html, baseURL: nil)
        }
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
