using HybridWebView;

namespace NetMauiIndexedDb
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();

            hwv.EnableWebDevTools = true;
        }

        private async void OnJsRawMessageReceived(object sender, HybridWebView.HybridWebViewRawMessageReceivedEventArgs e)
        {
            await Dispatcher.DispatchAsync(async () =>
            {
                await DisplayAlert("JavaScript message", e.Message, "OK");
            });
        }
    }
}
