Rails.application.routes.draw do
  root 'main#index'
  resources :favorites, only: [:index, :create, :destroy]
end
