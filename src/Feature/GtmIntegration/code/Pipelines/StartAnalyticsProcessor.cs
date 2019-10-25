using Sitecore.Diagnostics;
using Sitecore.Pipelines;
using System.Web;

namespace RDA.Feature.GtmIntegration.Pipelines
{
    public class StartAnalyticsProcessor
    {
        public virtual void Process(PipelineArgs args)
        {
            Assert.ArgumentNotNull((object)args, "args");

            if (!HttpContext.Current.Request.Url.AbsoluteUri.ToLower().Contains("scanalytics/registeranalyticsevent"))
            {
                args.AbortPipeline();
                if (Sitecore.Analytics.Tracker.IsActive)
                {
                    Sitecore.Analytics.Tracker.Current.Interaction.CurrentPage.Cancel();
                }
            }
        }
    }
}