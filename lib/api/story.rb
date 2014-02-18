module Api
  class Story
    include HTTParty

    base_uri ENV['GFW_API_HOST']

    def self.since(date)
      options = { :query => { :since => date } }

      get('/stories', options)
    end

    def self.featured
      response = get('/stories')

      response.select { |r| r['featured'] }
    end

    def self.create(params)
      options = {
                  :email => params['email'],
                  :date => params['date'],
                  :media => [
                              {
                                url: params['uploads_ids'],
                                embed_url:"",
                                preview_url: "http://gfw.stories.s3.amazonaws.com/uploads/thumb_forest.jpeg",
                                mime_type: "image/jpeg",
                                order: 1
                              }
                            ],
                  :geom => (if params['the_geom'] != ''
                              JSON.parse(params['the_geom'])
                            else
                              ''
                            end
                           ),
                  :details => params['details'],
                  :location => params['location'],
                  :name => params['name'],
                  :title => params['title']
                }.to_json

      response = post('/stories/new', :body => options,
                           :options => { :headers => { 'Content-Type' => 'application/json' } } )

      if response.success?
        response
      else
        nil
      end
    end

    def self.find_featured_by_page(page, stories_per_page)
      response = featured

      response.shift((page - 1) * stories_per_page)

      response.first(stories_per_page)
    end

    def self.find_by_id_or_token(id)
      get("/stories/#{id}")
    end
  end
end
