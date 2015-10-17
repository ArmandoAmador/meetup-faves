Rails.application.routes.draw do
  resources :favorites, only: [:index, :create, :destroy]
end
