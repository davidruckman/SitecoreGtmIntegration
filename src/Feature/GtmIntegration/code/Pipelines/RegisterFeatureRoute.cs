using Sitecore.Pipelines;
using System.Web.Mvc;
using System.Web.Routing;

namespace RDA.Feature.GtmIntegration.Pipelines
{
    public class RegisterFeatureRoute
    {
        public virtual void Process(PipelineArgs args)
        {
            RegisterRoute(RouteTable.Routes);
        }

        protected virtual void RegisterRoute(RouteCollection routes)
        {
            RouteTable.Routes.MapRoute("RDA.Feature.GtmIntegration.RegisterAnalyticsEvent.Api", "ScAnalytics/RegisterAnalyticsEvent", new
            {
                controller = "ScAnalytics",
                action = "RegisterAnalyticsEvent"
            });
        }
    }
}