using Sitecore.Analytics;
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.SearchTypes;
using Sitecore.Diagnostics;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Client.Configuration;
using Sitecore.XConnect.Collection.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace RDA.Feature.GtmIntegration.Controllers
{
    public class ScAnalyticsController : Controller
    {
        [HttpPost]
        public string RegisterAnalyticsEvent(List<string> json)
        {
            var sitecoreEventName = string.Empty;   //0
            var category = string.Empty;            //1
            var action = string.Empty;              //2
            var label = string.Empty;               //3
            var value = string.Empty;               //4
            var currencyCode = string.Empty;        //5
            decimal monetaryValue = 0;              //6
            var itemId = Guid.Empty;                //7
            var pageUrl = string.Empty;             //8
            var culture = string.Empty;             //9
            var itemVersion = 0;                    //10
            var firstName = string.Empty;           //11
            var lastName = string.Empty;            //12
            var jobTitle = string.Empty;            //13
            var email = string.Empty;               //14
            var clickUrl = string.Empty;            //15
            var clickText = string.Empty;           //16
            var isInternalTraffic = string.Empty;   //17
            var position = string.Empty;            //18
            var mediaItemId = Guid.Empty;           //19
            var mediaItemName = string.Empty;       //20
            var searchTerm = string.Empty;          //21
            var itemName = string.Empty;            //22
            var responseMessage = string.Empty;

            // Make sure Tracker is started.
            if (!Tracker.IsActive)
            {
                Tracker.StartTracking();
            }

            try
            {
                // Check for valid json.
                if (json == null)
                {
                    return "Invalid json";
                }

                // Check for valid event definition Name.
                sitecoreEventName = json[0].ToLower();
                if (string.IsNullOrEmpty(sitecoreEventName))
                {
                    return "Invalid Event Definition Name";
                }

                // If contact info provided then identify the contact. (independent of any event that is being registered).
                firstName = json[11];
                lastName = json[12];
                jobTitle = json[13];
                email = json[14];
                itemName = json[22];
                if (!string.IsNullOrEmpty(firstName) && !string.IsNullOrEmpty(lastName) && !string.IsNullOrEmpty(email))
                {
                    IdentifyContact(itemName, firstName, lastName, jobTitle, email);
                }

                // Check for valid category.
                category = json[1].ToLower();
                if (string.IsNullOrEmpty(category))
                {
                    return "Invalid category";
                }

                // Resolve the event definition ID.
                Guid eventDefinitionId = Guid.NewGuid();
                if (sitecoreEventName != "page view")
                {
                    var results = new List<SearchResultItem>();
                    ISearchIndex index = ContentSearchManager.GetIndex("sitecore_master_index");
                    using (IProviderSearchContext context = index.CreateSearchContext())
                    {
                        switch (category)
                        {
                            // Ensure we have an item definition ID.
                            case "page event":
                                results = context.GetQueryable<SearchResultItem>().Where(x => x.Path.StartsWith("/sitecore/system/Settings/Analytics/Page Events/") && x.Name == sitecoreEventName).ToList();
                                break;
                            case "goal":
                                results = context.GetQueryable<SearchResultItem>().Where(x => x.Path.StartsWith("/sitecore/system/Marketing Control Panel/Goals/") && x.Name == sitecoreEventName).ToList();
                                break;
                            case "campaign":
                                results = context.GetQueryable<SearchResultItem>().Where(x => x.Path.StartsWith("/sitecore/system/Marketing Control Panel/Campaigns/") && x.Name == sitecoreEventName).ToList();
                                break;
                            case "download":
                                eventDefinitionId = AnalyticsIds.DownloadEvent.Guid;
                                break;
                            case "search":
                                eventDefinitionId = AnalyticsIds.SearchEvent.Guid;
                                break;
                            case "outcome":
                                results = context.GetQueryable<SearchResultItem>().Where(x => x.Path.StartsWith("/sitecore/system/Marketing Control Panel/Outcomes/") && x.Name == sitecoreEventName).ToList();
                                break;
                            default:
                                return "Invalid Category";
                        }

                        if (results.Any())
                        {
                            eventDefinitionId = results.FirstOrDefault().ItemId.Guid;
                        }
                        else
                        {
                            return "Invalid Event Definition";
                        }
                    }
                }

                action = json[2];
                label = json[3];
                value = json[4];

                // Set item properties if all req values are present and valid.
                if (Guid.TryParse(json[7], out itemId))
                {
                    pageUrl = json[8];
                    culture = json[9];
                    // Check for valid item version.
                    if (!string.IsNullOrEmpty(culture) && int.TryParse(json[10], out itemVersion))
                    {
                        Tracker.Current.CurrentPage.SetItemProperties(itemId, culture, itemVersion);
                        Tracker.Current.CurrentPage.SetUrl(pageUrl);
                    }
                }

                // Register the event.
                Sitecore.Analytics.Data.PageEventData pageData = null;
                if (sitecoreEventName != "page view")
                {
                    switch (category)
                    {
                        case "page event":
                            var pageEventDefinition = Tracker.MarketingDefinitions.PageEvents[eventDefinitionId];
                            if (pageEventDefinition != null)
                            {
                                pageData = new Sitecore.Analytics.Data.PageEventData(pageEventDefinition.Alias, pageEventDefinition.Id);
                                Tracker.Current.CurrentPage.RegisterPageEvent(pageEventDefinition);
                            }
                            break;
                        case "goal":
                            var goalDefinition = Tracker.MarketingDefinitions.Goals[eventDefinitionId];
                            if (goalDefinition != null)
                            {
                                pageData = new Sitecore.Analytics.Data.PageEventData(goalDefinition.Alias, goalDefinition.Id);
                                Tracker.Current.CurrentPage.RegisterGoal(goalDefinition);
                            }
                            break;
                        case "campaign":
                            var campaignDefinition = Tracker.MarketingDefinitions.Campaigns[eventDefinitionId];
                            if (campaignDefinition != null)
                            {
                                pageData = new Sitecore.Analytics.Data.PageEventData(campaignDefinition.Alias, campaignDefinition.Id);
                                Tracker.Current.CurrentPage.TriggerCampaign(campaignDefinition);
                            }
                            break;
                        case "download":
                            if (Guid.TryParse(json[19], out mediaItemId))
                            {
                                var downloadDefinition = Tracker.MarketingDefinitions.PageEvents[eventDefinitionId];
                                if (downloadDefinition != null)
                                {
                                    pageData = new Sitecore.Analytics.Data.PageEventData(downloadDefinition.Alias, downloadDefinition.Id);
                                    Tracker.Current.CurrentPage.Register(new Sitecore.Analytics.Data.PageEventData(downloadDefinition.Alias, downloadDefinition.Id)
                                    {
                                        Text = mediaItemName, // Not mandatory
                                        ItemId = mediaItemId
                                    });
                                }
                            }
                            break;
                        case "search:":
                            var searchEventDefinition = Tracker.MarketingDefinitions.PageEvents[AnalyticsIds.SearchEvent.Guid];
                            if (searchEventDefinition != null)
                            {
                                pageData = new Sitecore.Analytics.Data.PageEventData(searchEventDefinition.Alias, searchEventDefinition.Id);
                                Tracker.Current.CurrentPage.Register(new Sitecore.Analytics.Data.PageEventData(searchEventDefinition.Alias, searchEventDefinition.Id)
                                {
                                    Data = searchTerm
                                });
                            }
                            break;
                        case "outcome":
                            currencyCode = json[5];
                            monetaryValue = decimal.Parse(json[6]);
                            var outcomeDefinition = Tracker.MarketingDefinitions.Outcomes[eventDefinitionId];
                            if (outcomeDefinition != null)
                            {
                                pageData = new Sitecore.Analytics.Data.PageEventData(outcomeDefinition.Alias, outcomeDefinition.Id);
                                Tracker.Current.Interaction.RegisterOutcome(outcomeDefinition, currencyCode, monetaryValue);
                            }
                            break;
                        default:
                            return "Invalid category";
                    }

                    // Add the page data.
                    if (pageData != null)
                    {
                        pageData.Data = value;
                        pageData.DataKey = label;
                        pageData.Text = action;

                        // Custom dimensions.
                        pageData.CustomValues.Add("Item Name", itemName);
                        pageData.CustomValues.Add("Page URL", pageUrl);
                        pageData.CustomValues.Add("Click URL", clickUrl);
                        pageData.CustomValues.Add("Click Text", clickText);
                        pageData.CustomValues.Add("Item ID", itemId);
                        pageData.CustomValues.Add("Item Culture", culture);
                        pageData.CustomValues.Add("Item Version", itemVersion);
                        pageData.CustomValues.Add("Is Internal Traffic", isInternalTraffic);
                        pageData.CustomValues.Add("Position", position);

                        Tracker.Current.CurrentPage.Register(pageData);
                    }
                }

                responseMessage = string.Format("RegisterAnalyticsEvent: sitecoreEventName='{0}', category='{1}', action='{2}', label='{3}', value='{4}', currencyCode='{5}', monetaryValue='{6}', itemId='{7}', pageUrl='{8}', culture='{9}', itemVersion='{10}', firstName='{11}', lastName='{12}', jobTitle='{13}', email='{14}', clickUrl='{15}', clickText='{16}', isInternalTraffic='{17}', position='{18}', mediaItemId='{19}', mediaItemName='{20}', searchTerm='{21}'", sitecoreEventName, category, action, label, value, currencyCode, monetaryValue, itemId.ToString(), pageUrl, culture, itemVersion, firstName, lastName, jobTitle, email, clickUrl, clickText, isInternalTraffic, position, mediaItemId, mediaItemName, searchTerm);
                Log.Info(responseMessage, this);

                return "Success! " + responseMessage;
            }
            catch (Exception ex)
            {
                responseMessage = string.Format("RegisterAnalyticsEvent Error: message='{0}', sitecoreEventName='{1}', category='{2}', action='{3}', label='{4}', value='{5}', currencyCode='{6}', monetaryValue='{7}', itemId='{8}', pageUrl='{9}', culture='{10}', itemVersion='{11}', firstName='{12}', lastName='{13}', jobTitle='{14}', email='{15}', clickUrl='{16}', clickText='{17}', isInternalTraffic='{18}', position='{19}', mediaItemId='{20}', mediaItemName='{21}', searchTerm='{22}'", ex.Message, sitecoreEventName, category, action, label, value, currencyCode, monetaryValue, itemId.ToString(), pageUrl, culture, itemVersion, firstName, lastName, jobTitle, email, clickUrl, clickText, isInternalTraffic, position, mediaItemId, mediaItemName, searchTerm);
                Log.Error(responseMessage, ex, this);
                return responseMessage;
            }

        }

        private void IdentifyContact(string source, string firstName, string lastName, string jobTitle, string email)
        {
            using (var client = this.CreateClient())
            {
                try
                {
                    var id = Tracker.Current.Contact.ContactId.ToString("N");

                    Tracker.Current.Session.IdentifyAs(source, id);

                    var trackerIdentifier = new IdentifiedContactReference(source, id);
                    var expandOptions = new ContactExpandOptions(
                        CollectionModel.FacetKeys.PersonalInformation,
                        CollectionModel.FacetKeys.EmailAddressList);

                    Contact contact = client.Get(trackerIdentifier, expandOptions);

                    SetPersonalInformation(firstName, lastName, jobTitle, contact, client);
                    SetEmail(email, contact, client);

                    client.Submit();
                }
                catch (Exception ex)
                {
                    Log.Error(ex.Message, ex, this);
                }
            }
        }

        /// <summary>
        /// Creates the client.
        /// </summary>
        /// <returns>The <see cref="IXdbContext"/> instance.</returns>
        protected virtual IXdbContext CreateClient()
        {
            return SitecoreXConnectClientConfiguration.GetClient();
        }


        /// <summary>
        /// Sets the <see cref="PersonalInformation"/> facet of the specified <paramref name="contact" />.
        /// </summary>
        /// <param name="firstName">The first name.</param>
        /// <param name="lastName">The last name.</param>
        /// <param name="jobTitle">The job title.</param>
        /// <param name="contact">The contact.</param>
        /// <param name="client">The client.</param>
        private static void SetPersonalInformation(string firstName, string lastName, string jobTitle, Contact contact, IXdbContext client)
        {
            PersonalInformation personalInfoFacet = contact.Personal() ?? new PersonalInformation();

            personalInfoFacet.FirstName = firstName;
            personalInfoFacet.LastName = lastName;
            personalInfoFacet.JobTitle = jobTitle;

            client.SetPersonal(contact, personalInfoFacet);
        }

        /// <summary>
        /// Sets the <see cref="EmailAddressList"/> facet of the specified <paramref name="contact" />.
        /// </summary>
        /// <param name="email">The email address.</param>
        /// <param name="contact">The contact.</param>
        /// <param name="client">The client.</param>
        private static void SetEmail(string email, Contact contact, IXdbContext client)
        {
            if (string.IsNullOrEmpty(email))
            {
                return;
            }

            EmailAddressList emailFacet = contact.Emails();
            if (emailFacet == null)
            {
                emailFacet = new EmailAddressList(new EmailAddress(email, false), "Preferred");
            }
            else
            {
                if (emailFacet.PreferredEmail?.SmtpAddress == email)
                {
                    return;
                }

                emailFacet.PreferredEmail = new EmailAddress(email, false);
            }

            client.SetEmails(contact, emailFacet);
        }

    }
}